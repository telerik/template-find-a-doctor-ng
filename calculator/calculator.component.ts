import { Component, ViewContainerRef, ViewChild, NgZone } from "@angular/core";
import { ListViewEventData } from "nativescript-ui-listview";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { ProcedureService } from "../shared/services/procedure.service"
import { Procedure } from "~/shared/models/procedure.model";
import { SearchBar } from "ui/search-bar";
import { EventData } from "data/observable";
import { RadListViewComponent } from "nativescript-ui-listview/angular";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "CalculatorComponent",
    moduleId: module.id,
    templateUrl: "./calculator.component.html",
    styleUrls: ["./calculator-common.css"],
    providers: [ProcedureService]
})
export class CalculatorComponent {
    procedures: ObservableArray<any>; // TODO: ObservableArray<Procedure>;
    procedure: string = "";
    isLoading: boolean;
    hasConsentToSearch: boolean = false;
    proceduresFilter: string = "";
    procedureFilteringFunc: Function;

    @ViewChild("proceduresListView") proceduresListView: RadListViewComponent;

    constructor(        
        private _procedureService: ProcedureService,
        private _routerExtensions: RouterExtensions,
        private _ngZone: NgZone
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.procedureFilteringFunc = this.getFilteringFunc();

        this._procedureService.getProcedures().then(procedures => {
            this.procedures = new ObservableArray<Procedure>(procedures);
            this.isLoading = false;
        });
    }

    procedureSelected(args: ListViewEventData) {
        console.log("procedureSelected");

        this.procedures.forEach(item => item.selected = false);
        const selectedItems = args.object.getSelectedItems();
        const item = selectedItems && selectedItems[0];
        if (item) {
            item.selected = true;
            this.procedure = item.procedure;
        }
    }

    getFilteringFunc() : (item: Procedure) => boolean {
        const filterFunc = (item: Procedure): boolean => {            
            return item.name.toLowerCase().includes(this.proceduresFilter.toLowerCase());
        };

        return filterFunc;
    }

    onProcedureFilterSubmit(args: EventData) {
        if (args) {
            const searchTextBar = <SearchBar>args.object;

            searchTextBar.dismissSoftInput();
        }
    }

    onProcedureFilterChange(args: EventData) {
        this.proceduresListView.listView.refresh();
    }

    onSubmitButtonTap(args: EventData) {
        let query = {
            procedure: this.procedure
        };

        console.log(query);
        this._routerExtensions.navigate(["/calculator-result", query],
            {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
    }
}